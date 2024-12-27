using System;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
}
