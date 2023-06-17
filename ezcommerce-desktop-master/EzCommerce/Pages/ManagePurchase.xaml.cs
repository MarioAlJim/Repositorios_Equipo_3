using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    /// Interaction logic for ManagePurchase.xaml
    /// </summary>
    public partial class ManagePurchase : Page
    {
       // private ObservableCollection<TuModeloDeDatos> datosTabla = new ObservableCollection<TuModeloDeDatos>();

        public ManagePurchase()
        {
            InitializeComponent();
           // miDataGrid.ItemsSource = datosTabla;
        }

        private void registerBttn_Click(object sender, RoutedEventArgs e)
        {
 /*
 TuModeloDeDatos nuevoElemento = new TuModeloDeDatos(); // Crear un nuevo elemento de datos

    // Asignar los valores correspondientes a las propiedades del nuevo elemento
    nuevoElemento.Fecha = DateTime.Now;
    nuevoElemento.Producto = "Producto Ejemplo";
    nuevoElemento.Cantidad = 5;
    // ...

    datosTabla.Add(nuevoElemento); // Agregar el nuevo elemento a la colección
 */
        }

        private void deleteBttn_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
