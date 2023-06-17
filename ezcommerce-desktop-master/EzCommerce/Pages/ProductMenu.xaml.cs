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
    /// Interaction logic for ProductMenu.xaml
    /// </summary>
    public partial class ProductMenu : Page
    {
        private class ProductData
        {

            public int inventory { get; set; }
            public string model { get; set; }
            public float price { get; set; }
            public float size { get; set; }
            public string brand { get; set; }
            public string category { get; set; }
            public Product product { get; set; }

            public ProductData(int inventory, string model, float price, float size, string brand, string category, Product product)
            {
                this.inventory = inventory;
                this.model = model;
                this.price = price;
                this.size = size;
                this.brand = brand;
                this.category = category;
                this.product = product;
            }
        }

        private List<ProductData> productsData = new List<ProductData>();

        public ProductMenu()
        {
            InitializeComponent();
            SetUpProductsDataGrid();
        }

        private void UpdateProductsDataGrid()
        {
            var search = searchTxtBox.Text;
            var searchResult = productsData.Where(product => 
                product.model.ToLower().Contains(search) || 
                product.brand.ToLower().Contains(search) || 
                product.category.ToLower().Contains(search)
            ).ToList();
            DataTable.ItemsSource = searchResult;
        }

        private void SetUpProductsDataGrid()
        {
            var result = Client.Instance.GetProducts().Result;
            var error = result.Item1;
            var data = result.Item2;
            if(error == Client.Error.Success)
            {
                foreach(var product in data)
                {
                    var brand = Client.Instance.GetBrand(product.brandId).Result;
                    var category = Client.Instance.GetCategory(product.categoryId).Result;
                    if(brand.Item1 == Client.Error.Success && category.Item1 == Client.Error.Success)
                    {
                        productsData.Add(new ProductData(product.inventory, product.model, product.price, product.size, brand.Item2.name, category.Item2.description, product));
                    }
                }
                UpdateProductsDataGrid();
            }
        }

        private void modifyBttn_Click(object sender, RoutedEventArgs e)
        {
            if(DataTable.SelectedIndex != -1)
            {
                var product = (DataTable.SelectedItem as ProductData).product;
                ModifyProduct modifyProduct = new ModifyProduct(product);
                MainWindow.Current.ContentFrame.NavigationService.Navigate(modifyProduct);
            }
            else
            {
                MessageBox.Show("Seleccione un producto.");
            }
        }

        private void registerBttn_Click(object sender, RoutedEventArgs e)
        {
            AddProduct addProduct = new AddProduct();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(addProduct);
        }

        private void deleteBttn_Click(object sender, RoutedEventArgs e)
        {
            var selectedIndex = DataTable.SelectedIndex;
            if(selectedIndex != -1)
            {
                var confirmation = MessageBox.Show("¿Está seguro de que desea eliminar el producto?", "Confirmación", MessageBoxButton.YesNo);
                if(confirmation == MessageBoxResult.Yes)
                {
                    var selectedProduct = DataTable.SelectedItem as ProductData;
                    var product = selectedProduct.product;
                    var result = Client.Instance.DeleteProduct(product.id).Result;
                    if (result == Client.Error.Success)
                    {
                        MessageBox.Show("Producto eliminado exitosamente.");
                        productsData.Remove(selectedProduct);
                        UpdateProductsDataGrid();
                    }
                    else
                    {
                        MessageBox.Show("No se pudo eliminar el producto.");
                    }
                }
            }
            else
            {
                MessageBox.Show("Seleccione un producto.");
            }
        }

        private void searchBttn_Click(object sender, RoutedEventArgs e)
        {
            UpdateProductsDataGrid();
        }
    }
}
