using System;
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

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(
                options => {
                    options.UseLazyLoadingProxies(); //Lazy Loading load
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

                }    
            );
            //, x => x.MigrationsAssembly("Persistent.Migrations") 

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000").AllowCredentials();
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
                        ValidateIssuer = false
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
      
            //app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");


            app.UseAuthentication();


            app.UseMvc();

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
