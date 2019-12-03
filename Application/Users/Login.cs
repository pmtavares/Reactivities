using Application.Errors;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<User> {
            public string Email { get; set; }
            public string Password { get; set; }

        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signManager;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signManager)
            {
                _userManager = userManager;
                _signManager = signManager;
            }

      
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                    throw new RestException(HttpStatusCode.Unauthorized);

                var result = await _signManager.CheckPasswordSignInAsync(user, request.Password, false);

                if(result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = "Token here",
                        Username = user.UserName,
                        Image = null
                    };
                    
                }

                throw new RestException(HttpStatusCode.Unauthorized);
            }
        }

    }
}
