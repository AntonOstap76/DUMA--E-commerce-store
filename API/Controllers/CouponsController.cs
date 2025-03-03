using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CouponsController(ICouponService service) : BaseApiController
{
    [HttpGet("{code}")]
    public async Task<ActionResult<AppCoupon>> ValidateCoupon(string code)
    {
        var coupon = await service.GetCouponFromPromoCode(code);

        if (coupon == null) return BadRequest("Invalid voucher code");

        return coupon;
    }
}
