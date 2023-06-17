using Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;


namespace EzCommerce
{
    /// <summary>
    /// Lógica de interacción para ManageRefunds.xaml
    /// </summary>
    public partial class ManageRefunds : Page
    {

        private RefundService _refundService;
        private List<RefundRequest> _refundRequests;
        private List<RefundRequest> _pending;
        private List<RefundRequest> _administered;

        public ManageRefunds()
        {
            InitializeComponent();

            _refundService = new RefundService();
            _refundRequests = new List<RefundRequest>();
            _pending = new List<RefundRequest>();
            _administered = new List<RefundRequest>();

            LoadRefundRequests();

        }

        private async void LoadRefundRequests()
        {
            RefundResponse refundResponse = await _refundService.GetAllRefundRequests();

            if (refundResponse != null && refundResponse.Requests != null)
            {
                _refundRequests = refundResponse.Requests;

                foreach (var refundRequest in _refundRequests)
                {
                    if (refundRequest.Status == 0)
                    {
                        _pending.Add(refundRequest);
                    }
                    else if (refundRequest.Status == 1 || refundRequest.Status == -1)
                    {
                        _administered.Add(refundRequest);
                    }
                }

                if(_pending.Count == 0)
                {
                //    dg_Pending.IsEnabled = false;
                }

                dg_Pending.ItemsSource = _pending;
                dg_Administered.ItemsSource = _administered;
            } else
            {
                MessageBox.Show("No se encontraron solicitudes de devoluciones");
            }
        }

        private async void RejectRefund(object sender, RoutedEventArgs e)
        {
            bool success = await _refundService.UpdateRefundStatus(1, -1);
            if (success)
            {
                MessageBox.Show("Estados actualizado exitosamente");
            }
            /*RefundRequest selectedRefund = (RefundRequest)dg_Pending.SelectedItem;

            if (selectedRefund != null)
            { 
                bool success = await _refundService.UpdateRefundStatus(selectedRefund.Id, -1);

                if (success)
                {
                    _pending.Remove(selectedRefund);
                    dg_Pending.ItemsSource = _pending;
                    _administered.Add(selectedRefund);
                    dg_Administered.ItemsSource = _administered;
                }
            }*/
        }

        private async void AceptRefund(object sender, RoutedEventArgs e)
        {
            bool success = await _refundService.UpdateRefundStatus(1, 1);
            if (success)
            {
                MessageBox.Show("Estados actualizado exitosamente");
            }
            /*RefundRequest selectedRefund = (RefundRequest)dg_Pending.SelectedItem;

            if (selectedRefund != null)
            {
                bool success = await _refundService.UpdateRefundStatus(selectedRefund.Id, 1);

                if (success)
                {
                    _pending.Remove(selectedRefund);
                    dg_Pending.ItemsSource = _pending;
                    _administered.Add(selectedRefund);
                    dg_Administered.ItemsSource = _administered;
                }
            }*/
        }

        private void CloseWindow(object sender, RoutedEventArgs e)
        {

        }
    }
}
