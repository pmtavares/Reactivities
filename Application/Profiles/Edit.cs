using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Edit
    {

        public class Command :IRequest
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }

        }

        public class ComandValidator : AbstractValidator<Command>
        {
            public ComandValidator() {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor user )
            {
                _context = context;
                _userAccessor = user;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());


                if (user == null)
                {
                    throw new Exception("Could not find user");
                }

                user.Bio = request.Bio ?? user.Bio;
                user.DisplayName = request.DisplayName ?? user.DisplayName;

                var success = await _context.SaveChangesAsync() > 0;

                if(success)
                {
                    return Unit.Value;
                }


                throw new Exception("Problem solving user");
            }
        }
    }
}
