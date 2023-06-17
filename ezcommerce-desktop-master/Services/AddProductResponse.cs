using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AddProductResponse
    {
        public string? message { get; set; }
        public Product? newProduct { get; set; }

        public AddProductResponse()
        {

        }
    }
}
