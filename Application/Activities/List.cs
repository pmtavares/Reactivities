using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {

                /* Eager loading : Included classes need to have virtual word removed
                 var activities = await _context.Activities
                     .Include(x => x.UserActivities)
                     .ThenInclude(x => x.AppUser)
                     .ToListAsync(); */
                var activities = await _context.Activities
                    .ToListAsync();

                var activityToReturn = _mapper.Map<List<Activity>, List<ActivityDto>>(activities);

                return activityToReturn;
            }
        }
    }
}
