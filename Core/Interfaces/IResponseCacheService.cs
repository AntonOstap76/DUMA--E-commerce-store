using System;

namespace Core.Interfaces;

public interface IResponseCacheService
{
    // to retreive cached things
    Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive);

    Task<string?>GetCachedResponseAsync(string cacheKey);

    Task RemoveCacheByPattern(string pattern);
}
