using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class Purchase
    {
        public int id { get; set; }
        public int productId { get; set; }
        public int personId { get; set; }
        public int quantity { get; set; }
        public int paymentMethodId { get; set; }
        public DateTime date { get; set; }
        public float total { get; set; }
        public string personName { get; set; }

        public Purchase()
        {

        }
    }
}
