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
    /// Interaction logic for ModifyProduct.xaml
    /// </summary>
    public partial class ModifyProduct : Page
    {
        private Product SelectedProduct { get; set; }

        public ModifyProduct(Product product)
        {
            SelectedProduct = product;
            InitializeComponent();
            SetUpComboBoxes();
            FillTextFields();
        }

        private void SetUpComboBoxes()
        {
            var brandsResult = Client.Instance.GetBrands().Result;
            var categoriesResult = Client.Instance.GetCategories().Result;

            if (brandsResult.Item1 == Client.Error.Success)
            {
                var brands = brandsResult.Item2;
                BrandCombobox.ItemsSource = brands;
            }

            if (categoriesResult.Item1 == Client.Error.Success)
            {
                var categories = categoriesResult.Item2;
                CategoryCombobox.ItemsSource = categories;
            }
        }

        private void FillTextFields()
        {
            modelTxtBx.Text = SelectedProduct.model;
            inventoryTxtBx.Text = SelectedProduct.inventory.ToString();
            priceTxtBx.Text = SelectedProduct.price.ToString();
            sizeTxtBx.Text = SelectedProduct.size.ToString();

            // Set brand and category of the selected product
            var brandsResult = Client.Instance.GetBrands().Result;
            var categoriesResult = Client.Instance.GetCategories().Result;

            if (brandsResult.Item1 == Client.Error.Success)
            {
                var brands = brandsResult.Item2;
                BrandCombobox.ItemsSource = brands;
                BrandCombobox.SelectedItem = brands.Where(b => b.id == SelectedProduct.brandId).FirstOrDefault();
            }

            if (categoriesResult.Item1 == Client.Error.Success)
            {
                var categories = categoriesResult.Item2;
                CategoryCombobox.ItemsSource = categories;
                CategoryCombobox.SelectedItem = categories.Where(c => c.id == SelectedProduct.categoryId).FirstOrDefault();
            }
        }

        private void backBttn_Click(object sender, RoutedEventArgs e)
        {
            ProductMenu productMenu = new ProductMenu();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(productMenu);
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
                    id = SelectedProduct.id,
                    brandId = brand.id,
                    categoryId = category.id,
                    model = model,
                    inventory = inventory,
                    price = price,
                    size = size
                };

                var result = Client.Instance.UpdateProduct(product).Result;
                if (result == Client.Error.Success)
                {
                    MessageBox.Show("Producto actualizado exitosamente.");
                    ProductMenu productMenu = new ProductMenu();
                    MainWindow.Current.ContentFrame.NavigationService.Navigate(productMenu);
                }
                else if (result == Client.Error.InvalidData)
                {
                    MessageBox.Show("Favor de ingresar datos válidos.");
                }
                else
                {
                    MessageBox.Show("Error al actualizar producto.");
                }
            }
        }
    }
}
