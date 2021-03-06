﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Middleware;
using Application.Activities;
using Application.Interfaces;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Persistent;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Infrastructure.Photos;
using API.SignalR;
using Application.Profiles;
using Microsoft.AspNetCore.Internal;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(
                 options => {
                 options.UseLazyLoadingProxies(); //Lazy Loading load
                    options.UseMySql(Configuration.GetConnectionString("DefaultConnection")); //MySQL

                 }
             );

            ConfigureServices(services);
        }
        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(
                 options => {
                     options.UseLazyLoadingProxies(); //Lazy Loading load
                     options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")); 

                 }
             );

            ConfigureServices(services);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*services.AddDbContext<DataContext>(
                options => {
                    options.UseLazyLoadingProxies(); //Lazy Loading load
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

                }    
            );*/
            //, x => x.MigrationsAssembly("Persistent.Migrations") 

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders("WWW-Authenticate") //Use this header information on the response
                    .WithOrigins("http://localhost:3000")
                    .AllowCredentials();
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);

            services.AddAutoMapper(typeof(List.Handler)); //AutoMapper dependency
            services.AddSignalR();

            services.AddMvc(opt =>
                    {
                        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                        opt.Filters.Add(new AuthorizeFilter(policy));
                    }
                
                )
                .AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<Create>())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);


            //Add Identity to manage users
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            //Add policy 
            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new HostRequirements());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();


            //Add JWT 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my ultra secret key"));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true, //Validate expire of token
                        ClockSkew = TimeSpan.Zero //When token expire, we will get error
                    };
                    //SignalR
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"]; //Comes from client
                            var path = context.HttpContext.Request.Path;
                            if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;

                        }
                    };
                });

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //User my exception middleware. Comment app.UseDeveloperExceptionPage
            app.UseMiddleware<ErrorHandlerMiddleware>();

            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //app.UseHsts();
            }

            //Security configurations: After built
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); //Prevent XXS reflected
            app.UseXfo(opt => opt.Deny()); //Prevent Clickjacking and Iframes
            app.UseCsp(opt => opt
                    .BlockAllMixedContent() //Prevent mized http/https
                    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
                    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
                    .FormActions(s => s.Self())
                    .FrameAncestors(s => s.Self())
                    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:", "data:"))
                    .ScriptSources(s => s.Self().CustomSources("sha256-EWcbgMMrMgeuxsyT4o76Gq/C5zilrLxiq6oTo2KDqus="))
            );

            //End security config


            app.UseDefaultFiles();
            app.UseStaticFiles();
            //app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");


            app.UseAuthentication();


            app.UseMvc(routes => {
                 routes.MapSpaFallbackRoute(
                     name: "SPA-Client",
                     defaults: new { controller = "Fallback", action = "index" }
                     );

             });
             


           
            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chat");
                

            });

            //For core 3.0
            /*
             * app.UseEndpoints(endpoints => { endpoints.MapControllers(); endpoints.MapHub<ChatHub>('/chat')})
             * 
             * 
             */
        }
    }
}
