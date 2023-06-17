using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class RefundRequest
    {
        public int Id { get; set; }
        public int Status { get; set; }
        public string Reason { get; set; }
        public int PurchaseId { get; set; }
    }

    public class RefundResponse
    {
        public List<RefundRequest> Requests { get; set; }
    }
}
