using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class Product
    {
        public int id { get; set; }
        public int inventory { get; set; }
        public string? model { get; set; }
        public float price { get; set; }
        public float size { get; set; }
        public int brandId { get; set; }
        public int categoryId { get; set; }

        public Product(int inventory, string model, float price, float size, int brandId, int categoryId)
        {
            this.inventory = inventory;
            this.model = model;
            this.price = price;
            this.size = size;
            this.brandId = brandId;
            this.categoryId = categoryId;
        }

        public Product()
        {

        }
    }
}
