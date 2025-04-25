const KEY = "pendingOps";

export function enqueueOperation(op) 
{
    const q = JSON.parse(localStorage.getItem(KEY)) || [];
    console.log("Before enqueue, current queue:", q);
    q.push(op);
    localStorage.setItem(KEY, JSON.stringify(q));
    console.log("After enqueue, saved queue:", q);
}

export function dequeueOperations() 
{
  const q = JSON.parse(localStorage.getItem(KEY)) || [];
  localStorage.removeItem(KEY);
  return q;
}