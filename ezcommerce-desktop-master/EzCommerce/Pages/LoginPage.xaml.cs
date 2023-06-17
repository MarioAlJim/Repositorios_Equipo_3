using Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
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
    /// Interaction logic for LoginPage.xaml
    /// </summary>
    public partial class LoginPage : Page
    {
        public LoginPage()
        {
            InitializeComponent();
            SetUpLabels();
        }

        private void SetUpLabels()
        {
            usernameRequiredText.Visibility = Visibility.Hidden;
            passwordRequiredText.Visibility = Visibility.Hidden;
            resultText.Visibility = Visibility.Hidden;
        }

        private void ShowMessage(string message, Brush color)
        {
            resultText.Content = message;
            resultText.Foreground = color;
            resultText.Visibility = Visibility.Visible;
        }

        private bool CheckFields()
        {
            bool areValid = true;
            if(usernameTextBox.Text.Length == 0)
            {
                usernameRequiredText.Visibility = Visibility.Visible;
                areValid = false;
            }
            else
            {
                usernameRequiredText.Visibility = Visibility.Hidden;
            }

            if(passwordPasswordBox.Password.Length == 0)
            {
                passwordRequiredText.Visibility = Visibility.Visible;
                areValid = false;
            }
            else
            {
                passwordRequiredText.Visibility = Visibility.Hidden;
            }
            return areValid;
        }

        private void Login()
        {
            if(CheckFields())
            {
                var client = Client.Instance;
                var username = usernameTextBox.Text;
                var password = passwordPasswordBox.Password;
                var result = client.AuthenticateEmployee(username, password);
                ShowMessage("Logging...", Brushes.White);


                result.ContinueWith(e =>
                {
                    Dispatcher.Invoke(() =>
                    {
                        switch (result.Result)
                        {
                            case Client.Error.Success:
                                ShowMessage("Logged in!", Brushes.Green);
                                
                                var menu = new Menu();
                                MainWindow.Current.MenuFrame.Content = menu;

                                var employeeMenu = new EmployeeMenu();
                                MainWindow.Current.ContentFrame.Content = employeeMenu;

                                MainWindow.Current.MainFrame.Content = null;
                                MainWindow.Current.MainFrame.Visibility = Visibility.Hidden;

                                break;

                            case Client.Error.InvalidCredentials:
                                ShowMessage("Invalid credentials!", Brushes.DarkRed);
                                break;

                            case Client.Error.ConnectionError:
                                ShowMessage("Connection error :(", Brushes.DarkRed);
                                break;

                            case Client.Error.ServerError:
                                ShowMessage("Server internal error X_x", Brushes.DarkRed);
                                break;

                            case Client.Error.ClientError:
                                ShowMessage("Client internal error X_x", Brushes.DarkRed);
                                break;

                            default:
                                ShowMessage("This is supposed to work!", Brushes.DarkRed);
                                break;
                        }
                    });
                });
            }
        }

        private void TextInput_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Return)
            {
                Login();
            }
        }

        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            Login();
        }
    }
}
