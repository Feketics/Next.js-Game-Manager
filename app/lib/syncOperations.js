import { dequeueOperations } from "./localQueue";
import { isServerAvailable } from "./serverCheck";

export async function syncPendingOperations() 
{
    if (!(await isServerAvailable())) 
    {
      console.log("Server still unavailable during sync.");
      return;
    }
    const ops = dequeueOperations();
    console.log("Syncing operations:", ops);
    for (const op of ops) 
    {
      try 
      {
        await fetch(op.endpoint, 
        {
          method: op.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.payload),
        });
        console.log("Synced op:", op);
      } 
      catch (err) 
      {
        console.error("Failed to sync op", op, err);
      }
    }
    window.dispatchEvent(new Event("syncComplete"));
}
  
