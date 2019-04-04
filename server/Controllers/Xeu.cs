using System;
using System.Net.Http;
using System.Threading.Tasks;
using BaseApi.Helper;
using BaseApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BaseApi.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class XeuController : Controller {
        private readonly HttpClient client = new HttpClient ();

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get ([FromQuery] string baseCurrency, [FromQuery] string symbols) {
            try {
                string apiKey = Environment.GetEnvironmentVariable ("API_KEY");
                var response = await client.GetStringAsync ($"http://data.fixer.io/api/latest?access_key={apiKey}&base={baseCurrency}&symbols={symbols}");
                return Ok (response);
            } catch (Exception e) {
                if (e is BadRequestException) {
                    return BadRequest (e.Message.ToBadRequest ());
                }
                return StatusCode (500);
            }
        }
    }
}