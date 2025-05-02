export async function POST() {
    return new Response(null, {
      status: 204,
      headers: {
        'Set-Cookie': 'token=deleted; Path=/; Max-Age=0'
      }
    });
  }
  