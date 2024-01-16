using Microsoft.EntityFrameworkCore;

namespace DWDADE1.Data
{
    public class DatabaseContext : DbContext 
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }
        public DbSet<Models.Product> Products { get; set; }
    }
}
