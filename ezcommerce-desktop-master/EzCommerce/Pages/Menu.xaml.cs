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
    /// Interaction logic for Menu.xaml
    /// </summary>
    public partial class Menu : Page
    {
        public Menu()
        {
            InitializeComponent();
        }

        private void employeeBttn_Click(object sender, RoutedEventArgs e)
        {
            EmployeeMenu employeeMenu = new EmployeeMenu();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(employeeMenu);
        }

        private void productBttn_Click(object sender, RoutedEventArgs e)
        {
            ProductMenu productMenu = new ProductMenu();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(productMenu);
        }

        private void purchaseBttn_Click(object sender, RoutedEventArgs e)
        {
            ManagePurchase managePurchase = new ManagePurchase();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(managePurchase);
        }

        private void refundBttn_Click(object sender, RoutedEventArgs e)
        {
            ManageRefunds manageRefunds = new ManageRefunds();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(manageRefunds);
        }

        private void summaryBttn_Click(object sender, RoutedEventArgs e)
        {
            ConsultPurchaseSummary consultPurchaseSummary = new ConsultPurchaseSummary();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(consultPurchaseSummary);
        }
    }
}
