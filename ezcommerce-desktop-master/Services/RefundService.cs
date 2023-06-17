using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Services
{
    public class RefundService
    {
        private static string ApiUrlBase = ConfigurationManager.AppSettings["api-url"];
        
        private static string Origin = ConfigurationManager.AppSettings["origin"];
        public enum RefError
        {
            InvalidCredentials,
            ConnectionError,
            ServerError,
            UnknownError
        }
        
        //private String _bearerToken = Client.Instance._token;
        private string authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlvMTUiLCJpYXQiOjE2ODY4MTIwNjYsImV4cCI6MTY4NjgyMjg2Nn0.06JJJtZmeBpNjuESOfT2Efve3mqj9NFJrO-LWuxZHuY";
        public async Task<RefundResponse> GetAllRefundRequests()
        {
            var url = string.Format("{0}/refund/getAll", "http://localhost:8080/api");
            RefundResponse result = new();
            try
            {
                using (var client = new HttpClient())
                {
                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);
                    request.Headers.Add("Origin", "http://localhost:8080");
                    request.Headers.Add("Authorization", authorization);
                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        result = await response.Content.ReadFromJsonAsync<RefundResponse>();
                    }
                    else
                    {
                        Console.WriteLine("Error en la petición HTTP: " + response.StatusCode);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Excepción al realizar la petición HTTP: " + e.Message);
            }

            return result;
        }

        public async Task<bool> UpdateRefundStatus(int refundId, int newStatus)
        {
            string apiUrl = "http://localhost:8080/api";
            string endpoint = string.Format("{0}/refund/{1}", apiUrl, refundId);

            try
            {
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage(HttpMethod.Put, endpoint);
                    request.Headers.Add("Origin", "http://localhost:8080");
                    request.Headers.Add("Authorization", authorization);

                    var requestBody = new { status = newStatus };
                    string jsonBody = JsonSerializer.Serialize(requestBody);
                    request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                    var response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        return true;
                    }
                    else
                    {
                        Console.WriteLine("Error en la petición HTTP: " + response.StatusCode);
                        return false;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Excepción al realizar la petición HTTP: " + e.Message);
                return false;
            }
        }
    }
}
