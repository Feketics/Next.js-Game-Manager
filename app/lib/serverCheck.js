export async function isServerAvailable() 
{
    try 
    {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("Server unavailable");
      return true;
    } 
    catch 
    {
      return false;
    }
  }
  