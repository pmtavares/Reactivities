using System;
using System.Net;
using System.Text;

namespace Application.Errors
{
    public class RestException :Exception
    {
        public HttpStatusCode _code { get; set; }
        public object _errors { get; }
        public RestException(HttpStatusCode code, object errors = null )
        {
            _code = code;
            _errors = errors;
        }
    }
}
