using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Profiles
{
    //This class can serve as DTO
    public class Profile
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}
