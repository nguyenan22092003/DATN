using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Configurations
{
    public class LocationCustomerConfiguration : IEntityTypeConfiguration<LocationCustomer>
    {
        public void Configure(EntityTypeBuilder<LocationCustomer> builder)
        {
            builder.HasKey(p=>p.LocationCustomerID);

            builder.HasOne(p=>p.PotentialCustomer).WithMany(p=>p.LocationCustomers).HasForeignKey(p=>p.PotentialCustomerID);
        }
    }
}
