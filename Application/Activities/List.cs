using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        //Class created to implement paging
        //We have to bring the activities count
        // Then, instead of return ActivityCto on query, this class will be returned instead
        public class ActivitiesEnvelop
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        public class Query : IRequest<ActivitiesEnvelop>
        {
            public int? Limit { get; set; }
            public int? OffSet { get; set; }

            public bool IsGoing { get; set; }

            public bool IsHost { get; set; }

            public DateTime? StartDate { get; set; }
            public Query(int? limite, int? offset, bool isGoing, bool isHost, DateTime? startDate )
            {
                Limit = limite;
                OffSet = offset;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.Now;
            }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelop>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<ActivitiesEnvelop> Handle(Query request, CancellationToken cancellationToken)
            {

                /* Eager loading : Included classes need to have virtual word removed
                 var activities = await _context.Activities
                     .Include(x => x.UserActivities)
                     .ThenInclude(x => x.AppUser)
                     .ToListAsync(); */

                var queryable = _context.Activities
                    .Where(x=> x.Date >= request.StartDate)
                    .OrderBy(x=> x.Date)
                    .AsQueryable();

                if(request.IsGoing && !request.IsHost)
                {
                    queryable = queryable.Where(x => x.UserActivities.Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername()));
                }


                if(request.IsHost && !request.IsGoing)
                {
                    queryable = queryable
                            .Where(x => x.UserActivities
                            .Any(a => a.AppUser.UserName == _userAccessor.GetCurrentUsername() && a.IsHost));
                }

                var activities = await queryable
                    .Skip(request.OffSet ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                var activityToReturn = new ActivitiesEnvelop
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
        

                return activityToReturn;
            }
        }
    }
}
