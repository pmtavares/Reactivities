using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace Persistent
{
    public class DataContext :IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base (options)
        {

        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }


        //Seed Data into table
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); //Need to add this line because of IdentityDbContext<AppUser>

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name="Value 101"},
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );
        }
    }
}
