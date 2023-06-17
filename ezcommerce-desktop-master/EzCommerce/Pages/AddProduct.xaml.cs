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
    /// Interaction logic for AddProduct.xaml
    /// </summary>
    public partial class AddProduct : Page
    {
        public AddProduct()
        {
            InitializeComponent();
            SetUpComboBoxes();
        }

        private void backBttn_Click(object sender, RoutedEventArgs e)
        {
            ProductMenu productMenu = new ProductMenu();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(productMenu);
        }

        private void SetUpComboBoxes()
        {
            var brandsResult = Client.Instance.GetBrands().Result;
            var categoriesResult = Client.Instance.GetCategories().Result;

            if(brandsResult.Item1 == Client.Error.Success)
            {
                var brands = brandsResult.Item2;
                BrandCombobox.ItemsSource = brands;
            }

            if(categoriesResult.Item1 == Client.Error.Success)
            {
                var categories = categoriesResult.Item2;
                CategoryCombobox.ItemsSource = categories;
            }
        }

        private void registerBttn_Click(object sender, RoutedEventArgs e)
        {
            if (!Validator.ValidateText(modelTxtBx.Text, 50, 1, true) && !Validator.ValidateTextAlpha(modelTxtBx.Text, 50, 1, false))
            {
                MessageBox.Show("Favor de ingresar un modelo válido.");
            }
            else if (!Validator.ValidateTextNumeric(inventoryTxtBx.Text, 10, 1, false))
            {
                MessageBox.Show("Favor de ingresar un número válido.");
            }
            else if (!Validator.ValidateTextNumeric(priceTxtBx.Text, 10, 1, false))
            {
                MessageBox.Show("Favor de ingresar un precio válido.");
            }
            else if (!Validator.ValidateTextNumeric(sizeTxtBx.Text, 2, 1, false))
            {
                MessageBox.Show("Favor de ingresar una talla válida.");
            }
            else
            {
                var brand = (Brand)BrandCombobox.SelectedItem;
                var category = (Category)CategoryCombobox.SelectedItem;
                var model = modelTxtBx.Text;
                var inventory = int.Parse(inventoryTxtBx.Text);
                var price = float.Parse(priceTxtBx.Text);
                var size = float.Parse(sizeTxtBx.Text);

                var product = new Product()
                {
                    brandId = brand.id,
                    categoryId = category.id,
                    model = model,
                    inventory = inventory,
                    price = price,
                    size = size
                };

                var result = Client.Instance.AddProduct(product).Result;
                if (result.Item1 == Client.Error.Success)
                {
                    MessageBox.Show("Producto agregado exitosamente.");
                    ProductMenu productMenu = new ProductMenu();
                    MainWindow.Current.ContentFrame.NavigationService.Navigate(productMenu);
                }
                else if (result.Item1 == Client.Error.InvalidData)
                {
                    MessageBox.Show("Favor de ingresar datos válidos.");
                }
                else
                {
                    MessageBox.Show("Error al agregar producto.");
                }
            }
        }
    }
}
