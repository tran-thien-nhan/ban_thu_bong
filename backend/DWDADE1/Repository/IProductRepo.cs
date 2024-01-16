using DWDADE1.Models;

namespace DWDADE1.Repository
{
    public interface IProductRepo
    {
        Task<IEnumerable<Product>> GetProducts();
        Task<Product> AddProduct(Product product, IFormFile file);
        Task<Product> UpdateProduct(Product product, IFormFile file);
        Task<Product> DeleteProduct(int id);

        //update status product
        Task<Product> UpdateStatusProduct(int id);

        //hiển thị danh sách có status là true
        Task<IEnumerable<Product>> GetProductsStatusTrue();

        //làm thêm chức năng sort sản phẩm theo giá min và max
        Task<IEnumerable<Product>> SortProductByPrice(int min, int max);
    }
}
