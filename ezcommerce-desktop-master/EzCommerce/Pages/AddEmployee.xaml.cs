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
using static Services.User;

namespace EzCommerce
{
    /// <summary>
    /// Interaction logic for AddEmployee.xaml
    /// </summary>
    public partial class AddEmployee : Page
    {
        public AddEmployee()
        {
            InitializeComponent();
            SetUpUserTypeComboBox();
        }

        private void SetUpUserTypeComboBox()
        {
            RoleComboBox.Items.Add("Administrador");
            RoleComboBox.Items.Add("Encargado de ventas");
            RoleComboBox.Items.Add("Gerente de inventario");
        }

        private void backBttn_Click(object sender, RoutedEventArgs e)
        {
            EmployeeMenu employeeMenu = new EmployeeMenu();
            MainWindow.Current.ContentFrame.NavigationService.Navigate(employeeMenu);
        }

        private void registerBttn_Click(object sender, RoutedEventArgs e)
        {
            if (!Validator.ValidateText(nameTxtBx.Text, 50, 1, false) && !Validator.ValidateTextAlpha(nameTxtBx.Text, 50, 1, false))
            {
                MessageBox.Show("Favor de ingresar sólo tu primer nombre.");
                return;
            }
            else if (!Validator.ValidateText(paternalTxtBx.Text, 50, 1, false) && !Validator.ValidateTextAlpha(paternalTxtBx.Text, 50, 1, false))
            {
                MessageBox.Show("Favor de ingresar sólo tu apellido paterno.");
            }
            else if (!Validator.ValidateText(maternalTxtBx.Text, 50, 1, false) && !Validator.ValidateTextAlpha(maternalTxtBx.Text, 50, 1, false))
            {
                MessageBox.Show("Favor de ingresar sólo tu apellido materno.");
            }
            else if (!Validator.ValidateText(usernameTxtBx.Text, 50, 1, false) && !Validator.ValidateTextAlphaNumeric(usernameTxtBx.Text, 50, 1, false))
            {
                MessageBox.Show("Favor de no dejar espacios en blanco.");
            }
            else if (!Validator.ValidateTextNumeric(phoneTxtBx.Text, 10, 1, false))
            {
                MessageBox.Show("Favor de ingresar sólo números en el campo de teléfono.");
            }
            else if (!Validator.ValidateText(emailTxtBx.Text, 50, 1, false) && !Validator.ValidateEmail(emailTxtBx.Text)) 
            {
                MessageBox.Show("Favor de ingresar un correo electrónico válido.");
            }
            else if (!Validator.ValidateText(passwordBox.Password, 50, 1, false) && !Validator.CheckPasswordStrength(passwordBox.Password))
            {
                MessageBox.Show("Favor de ingresar una contraseña segura.");
            }
            else
            {
                var name = nameTxtBx.Text;
                var paternal = paternalTxtBx.Text;
                var maternal = maternalTxtBx.Text;
                var username = usernameTxtBx.Text;
                var phone = phoneTxtBx.Text;
                var email = emailTxtBx.Text;
                var password = passwordBox.Password;
                DateOnly birthdate = new DateOnly(birthdatePicker.SelectedDate.Value.Year, birthdatePicker.SelectedDate.Value.Month, birthdatePicker.SelectedDate.Value.Day);

                // check if user is 18 years old or older
                if(birthdatePicker.SelectedDate.Value.AddYears(18) > DateTime.Now)
                {
                    MessageBox.Show("El usuario debe ser mayor de 18 años.");
                    return;
                }

                UserType role;
                var selectedRole = RoleComboBox.SelectedItem as string;
                if (selectedRole == "Administrador")
                {
                    role = UserType.Admin;
                }
                else if (selectedRole == "Encargado de ventas")
                {
                    role = UserType.Attendant;
                }
                else
                {
                    role = UserType.InventoryManager;
                }

                var user = new User(name, paternal, maternal, birthdate, email, phone, username, password, role);

                var result = Client.Instance.AddUser(user).Result;
                if(result == Client.Error.Success)
                {
                    MessageBox.Show("Usuario registrado exitosamente.");
                    EmployeeMenu employeeMenu = new EmployeeMenu();
                    MainWindow.Current.ContentFrame.NavigationService.Navigate(employeeMenu);
                }
                else
                {
                    MessageBox.Show("Hubo un error al registrar el usuario.");
                }
            }
        }
    }
}
