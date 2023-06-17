using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AuthResponse
    {
        public string message { get; set; }
        public string? token { get; set; }

        public AuthResponse(string message, string? token)
        {
            this.message = message;
            this.token = token;
        }
    }
}
