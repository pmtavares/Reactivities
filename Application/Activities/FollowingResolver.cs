using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.Activities
{
    //This class is to be able to insert parameter in Profile Mapper
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public FollowingResolver(DataContext context, IUserAccessor userAcessor)
        {
            _userAccessor = userAcessor;
            _context = context;
        }
        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername()).Result;

            if(currentUser.Followings.Any(x=> x.TargetId == source.AppUserId))
            {
                return true;
            }
            return false;

        }
    }
}
