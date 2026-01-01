using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CuidarPet.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            app = "CuidarPet API",
            version = "1.0.0",
            timestamp = DateTime.UtcNow
        });
    }
}
