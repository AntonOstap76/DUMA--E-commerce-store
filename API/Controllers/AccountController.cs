using System;
using System.Security.Claims;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

//inject SignInmanager to manage users
//signInManager mostly used yo log in user, check their password, sign the user in 
public class AccountController(SignInManager<AppUser> signInManager) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };
        //create user 
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        //check result
        if(!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]

    public async Task<ActionResult>Logout()
    {
        await signInManager.SignOutAsync();

        return NoContent();
    }

    [HttpGet("user-info")]

    public async Task<ActionResult> GetUserInfo()
    {
        if(User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.Users
        .FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));

        if (user == null) return Unauthorized();

        return Ok(new 
        {
            user.FirstName,
            user.LastName, 
            user.Email
        });

    }

    [HttpGet]

    public ActionResult GetAuthState()
    {
        return Ok(new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated ?? false
        });
    }

}