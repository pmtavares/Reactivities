using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly SymmetricSecurityKey _key;
        public JwtGenerator(IConfiguration config)
        {
            //_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("Jwt").GetSection("TokenKey").Value));
        }
        public string CreateToken(AppUser user)
        {
            //Build up the token
            //List of claims
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };

            //generate signing credentials
            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my ultra secret key"));
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);


            //Token
            var tokenDescriptior = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptior);

            return tokenHandler.WriteToken(token);

        }
    }
}
