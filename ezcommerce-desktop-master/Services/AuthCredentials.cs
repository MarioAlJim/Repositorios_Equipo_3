using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AuthCredentials
    {
        public string username { get; set; }
        public string password { get; set; }

        public AuthCredentials(string username, string password)
        {
            this.username = username;
            this.password = password;
        }
    }
}
