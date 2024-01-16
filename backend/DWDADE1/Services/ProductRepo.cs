using DWDADE1.Data;
using DWDADE1.Helper;
using DWDADE1.Models;
using DWDADE1.Repository;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace DWDADE1.Services
{
    public class ProductRepo : IProductRepo
    {
        private readonly DatabaseContext db;

        public ProductRepo(DatabaseContext db)
        {
            this.db = db;
        }

        public async Task<Product> AddProduct(Product product, IFormFile file)
        {
            using (var transaction = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    product.Id = default;

                    if (file != null)
                    {
                        product.Image = FileUpload.SaveImages("productImage", file);
                    }

                    await db.Products.AddAsync(product);
                    await db.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return product;
                }
                catch (Exception ex)
                {
                    if (product.Image != null)
                    {
                        FileUpload.DeleteImage(product.Image);
                    }

                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<Product> DeleteProduct(int id)
        {
            var product = await db.Products.FindAsync(id);
            if (product != null)
            {
                if (product.Image != null)
                {
                    FileUpload.DeleteImage(product.Image);
                }
                db.Products.Remove(product);
                await db.SaveChangesAsync();
            }
            return product;
        }

        public async Task<IEnumerable<Product>> GetProducts()
        {
            return await db.Products.ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsStatusTrue()
        {
            return await db.Products.Where(p => p.Status == true).ToListAsync();
        }

        public async Task<Product> UpdateStatusProduct(int id)
        {
            var product = await db.Products.FindAsync(id);
            if (product != null)
            {
                product.Status = !product.Status;
                db.Products.Update(product);
                await db.SaveChangesAsync();
            }
            return product;
        }

        public async Task<Product> UpdateProduct(Product product, IFormFile file)
        {
            var updateProduct = await db.Products.FindAsync(product.Id);
            if (updateProduct != null)
            {
                updateProduct.Name = product.Name;
                updateProduct.Price = product.Price;
                updateProduct.Status = product.Status;
                if (file != null)
                {
                    // Delete existing image
                    FileUpload.DeleteImage(updateProduct.Image);

                    // Save new image and update product
                    string imageUrl = FileUpload.SaveImages("product_images", file);
                    updateProduct.Image = imageUrl;
                }
                db.Products.Update(updateProduct);
                await db.SaveChangesAsync();
            }
            return updateProduct;
        }

        public async Task<IEnumerable<Product>> SortProductByPrice(int min, int max)
        {
            return await db.Products.Where(p => p.Price >= min && p.Price <= max).ToListAsync();
        }
    }
}
