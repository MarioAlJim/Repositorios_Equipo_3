using Services;
using System;
using System.Collections.Generic;
using System.Data;
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
    /// Interaction logic for EmployeeMenu.xaml
    /// </summary>
    public partial class EmployeeMenu : Page
    {
        private class UserData
        {
            public string name { get; set; }
            public string paternalSurname { get; set; }
            public string maternalSurname { get; set; }
            public string email { get; set; }
            public string phone { get; set; }
            public string role { get; set; }
            public string username { get; set; }
            public string birthdate { get; set; }
            public User user { get; set; }

            public UserData(string name, string paternalSurname, string maternalSurname, string email, string phone, string role, string username, string birthdate, User user)
            {
                this.name = name;
                this.paternalSurname = paternalSurname;
                this.maternalSurname = maternalSurname;
                this.email = email;
                this.phone = phone;
                this.role = role;
                this.username = username;
                this.birthdate = birthdate;
                this.user = user;
            }
        }

        private List<UserData> usersData = new List<UserData>();

        public EmployeeMenu()
        {
            InitializeComponent();
            SetUpUsersDataGrid();
        }

        private void UpdateUsersDataGrid()
        {
            var search = SearchTextBox.Text;
            var searchResult = usersData.Where(user =>
                user.name.ToLower().Contains(search) ||
                user.paternalSurname.ToLower().Contains(search) ||
                user.maternalSurname.ToLower().Contains(search) ||
                user.email.ToLower().Contains(search) ||
                user.phone.ToLower().Contains(search) ||
                user.role.ToLower().Contains(search) ||
                user.username.ToLower().Contains(search) ||
                user.birthdate.ToLower().Contains(search)
            ).ToList();
            DataTable.ItemsSource = searchResult;
        }

        private void SetUpUsersDataGrid()
        {
            var result = Client.Instance.GetUsers().Result;
            var error = result.Item1;
            var data = result.Item2;
            if (error == Client.Error.Success)
            {
                foreach (var user in data)
                {
                    var birthdate = user.birthdate.ToString();
                    string role = "";
                    switch(user.role)
                    {
                        case User.UserType.Admin:
                            role = "Administrador";
                            break;
                        case User.UserType.Attendant:
                            role = "Vendedor";
                            break;
                        case User.UserType.InventoryManager:
                            role = "Gerente de inventario";
                            break;
                        case User.UserType.Customer:
                            role = "Cliente";
                            break;
                    }

                    if(user.role != User.UserType.Customer && user.username != Client.Instance.Username)
                    {
                        var userData = new UserData(user.name, user.paternalSurname, user.maternalSurname, user.email, user.phone, role, user.username, birthdate, user);
                        usersData.Add(userData);
                    }
                }
                UpdateUsersDataGrid();
            }
        }

        private void modifyBttn_Click(object sender, RoutedEventArgs e)
        {
            if (DataTable.SelectedIndex != -1)
            {
                var user = (DataTable.SelectedItem as UserData).user;
                ModifyEmployee modifyEmployee = new ModifyEmployee(user);
                MainWindow.Current.ContentFrame.NavigationService.Navigate(modifyEmployee);
            }
            else
            {
                MessageBox.Show("Seleccione un usuario.");
            }
        }

        private void registerBttn_Click(object sender, RoutedEventArgs e)
        {
            AddEmployee addEmployee = new AddEmployee();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(addEmployee);
        }

        private void deleteBttn_Click(object sender, RoutedEventArgs e)
        {
            var selectedIndex = DataTable.SelectedIndex;
            if (selectedIndex != -1)
            {
                var confirmation = MessageBox.Show("¿Está seguro de que desea eliminar el usuario?", "Confirmación", MessageBoxButton.YesNo);
                if (confirmation == MessageBoxResult.Yes)
                {
                    var selectedProduct = DataTable.SelectedItem as UserData;
                    var user = selectedProduct.user;
                    var result = Client.Instance.DeleteUser(user.username).Result;
                    if (result == Client.Error.Success)
                    {
                        MessageBox.Show("Usuario eliminado exitosamente.");
                        usersData.Remove(selectedProduct);
                        UpdateUsersDataGrid();
                    }
                    else
                    {
                        MessageBox.Show("No se pudo eliminar el usuario.");
                    }
                }
            }
            else
            {
                MessageBox.Show("Seleccione un usuario.");
            }
        }

        private void searchBttn_Click(object sender, RoutedEventArgs e)
        {
            UpdateUsersDataGrid();
        }

    }
}
