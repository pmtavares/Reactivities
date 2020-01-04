using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Persistent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    //Create new Policy
    public class HostRequirements :IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<HostRequirements>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public IsHostRequirementHandler(IHttpContextAccessor httpContestAccessor, DataContext context)
        {
            _httpContextAccessor = httpContestAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, 
            HostRequirements requirement)
        {
            if(context.Resource is AuthorizationFilterContext authContext)
            {
                //Get current user
                var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?
                    .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                var activityId = Guid.Parse(authContext.RouteData.Values["id"].ToString());

                var activity = _context.Activities.FindAsync(activityId).Result;

                var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

                if (host?.AppUser?.UserName == currentUserName)
                    context.Succeed(requirement);

            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }

        //The code below is just to implement in Core 3.0
        protected Task HandleRequirementAsyncAspCore3(AuthorizationHandlerContext context,
            HostRequirements requirement)
        {
            
                //Get current user
                var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?
                    .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

               // var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues
                 //       .SingleOrDefault(x=> x.Key == "id").Value.ToString());

               // var activity = _context.Activities.FindAsync(activityId).Result;

                //var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

                //if (host?.AppUser?.UserName == currentUserName)
                  //  context.Succeed(requirement);



            return Task.CompletedTask;


        }
    }

}
