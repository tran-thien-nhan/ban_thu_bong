using DWDADE1.Models;
using DWDADE1.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DWDADE1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepo repo;

        public ProductController(IProductRepo repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> GetProducts()
        {
            return await repo.GetProducts();
        }

        [HttpGet("status")]
        public async Task<IEnumerable<Product>> GetProductsStatusTrue()
        {
            return await repo.GetProductsStatusTrue();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct([FromForm] Product product, IFormFile file)
        {
            var newProduct = await repo.AddProduct(product, file);
            return CreatedAtAction(nameof(GetProducts), new { id = newProduct.Id }, newProduct);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await repo.DeleteProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpPut("status/{id}")]
        public async Task<ActionResult<Product>> UpdateStatusProduct(int id)
        {
            var product = await repo.UpdateStatusProduct(id);
            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromForm] Product product, IFormFile file)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            var updateProduct = await repo.UpdateProduct(product, file);
            if (updateProduct == null)
            {
                return NotFound();
            }
            return updateProduct;

        }

        [HttpGet("sort")]
        public async Task<IEnumerable<Product>> SortProductByPrice(int min, int max)
        {
            return await repo.SortProductByPrice(min, max);
        }
    }
}
