using Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace EzCommerce
{
    /// <summary>
    /// Interaction logic for ConsultPurchaseSummary.xaml
    /// </summary>
    public partial class ConsultPurchaseSummary : Page
    {
        public class PurchaseData
        {
            public string date { get; set; }
            public string model { get; set; }
            public string quantity { get; set; }
            public string total { get; set; }
            public string paymentMethod { get; set; }
            public string person { get; set; }
            public Purchase purchase { get; set; }

            public PurchaseData(string date, string model, string quantity, string total, string paymentMethod, string person, Purchase purchase)
            {
                this.date = date;
                this.model = model;
                this.quantity = quantity;
                this.total = total;
                this.paymentMethod = paymentMethod;
                this.person = person;
                this.purchase = purchase;
            }
        }

        public List<PurchaseData> PurchasesData = new List<PurchaseData>();

        public ConsultPurchaseSummary()
        {
            InitializeComponent();
            SetUpPurchaseSummary();
        }

        private void SetUpPurchaseSummary()
        {
            var result = Client.Instance.GetPurchases().Result;
            var error = result.Item1;
            var data = result.Item2;
            if (error == Client.Error.Success)
            {
                foreach (var purchase in data)
                {
                    var product = Client.Instance.GetProduct(purchase.productId).Result.Item2;
                    string paymentMethod = "";
                    if(purchase.paymentMethodId == 1)
                    {
                        paymentMethod = "Efectivo";
                    }
                    else if(purchase.paymentMethodId == 2)
                    {
                        paymentMethod = "Tarjeta";
                    }

                    var purchaseData = new PurchaseData(
                        purchase.date.ToString("dd/MM/yyyy"),
                        product.model,
                        purchase.quantity.ToString(),
                        purchase.total.ToString(),
                        paymentMethod,
                        purchase.personName,
                        purchase
                    );

                    PurchasesData.Add(purchaseData);
                }
                PurchasesDataGrid.ItemsSource = PurchasesData;
            }
        }
    }
}
