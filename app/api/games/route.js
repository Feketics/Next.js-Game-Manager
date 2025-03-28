let games = [
    {
        id: 1,
        name: "Factorio",
        description: "The Factory must grow!",
        publisher: "Publisher1",
        datePublished: "2023-01-01",
        rating: 8.5,
        category: "Strategy",
      },
      {
        id: 2,
        name: "Terraria",
        description: "Idk haven't played it.",
        publisher: "Publisher2",
        datePublished: "2023-11-01",
        rating: 8,
        category: "Rpg",
      },
      {
        id: 3,
        name: "Baldur's Gate 3",
        description: "The gate that belongs to Baldur or something.",
        publisher: "Publisher1",
        datePublished: "2024-07-18",
        rating: 8.75,
        category: "Rpg",
      },
      {
        id: 4,
        name: "Minecraft",
        description: "It's minecraft.",
        publisher: "Publisher2",
        datePublished: "2002-11-21",
        rating: 9,
        category: "Sandbox",
      },
      {
        id: 5,
        name: "League of Legends",
        description: "Rating given by the players, not me!",
        publisher: "Publisher3",
        datePublished: "2017-12-12",
        rating: 7,
        category: "Moba?",
      },
      {
        id: 6,
        name: "Stellaris",
        description: "Not for the faint of heart.",
        publisher: "Paradox",
        datePublished: "2023-01-01",
        rating: 7.95,
        category: "Strategy",
      }
  ];
  
  const corsHeaders = 
  {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  function validateGame(data) 
  {
    const errors = [];

    if (!data.name || data.name.trim() === '') 
    {
      errors.push('Name is required.');
    }

    if (!data.description || data.description.trim() === '')
    {
        errors.push('Description is required.')
    }

    if (!data.category || data.category.trim() === '')
    {
          errors.push('Category is required.')
    }

    if (!data.publisher || data.publisher.trim() === '')
    {
          errors.push('Publisher is required.')
    }

    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) 
    {
      errors.push('Rating must be a number between 1 and 10.');
    }

    const ratingParts = data.rating.toString().split('.');
    if (ratingParts.length > 1 && ratingParts[1].length > 2) 
    {
      errors.push('Rating can have at most two decimal places.');
    }

    if (data.datePublished) 
    {
      const date = new Date(data.datePublished);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) 
      {
        errors.push('Date published cannot be in the future.');
      }
      const minDate = new Date('1970-01-01');
      if (date < minDate) 
      {
        errors.push('Date published cannot be before 1970.');
      }
    }
    else
    {
      errors.push('Publish date is required.');
    }
    return errors;
  }
  
  export async function OPTIONS() 
  {
    return new Response(null, 
    {
      status: 200,
      headers: corsHeaders,
    });
  }
  
  export async function GET(request) 
  {
    const { searchParams } = new URL(request.url);
    let result = games;

    const search = searchParams.get('search');
    if (search) 
    {
      result = result.filter(
        game =>
          game.name.toLowerCase().includes(search.toLowerCase()) ||
          game.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    const sortParam = searchParams.get('sort');
    if (sortParam) 
    {
      const [key, direction] = sortParam.split('-');

      result = result.sort((a, b) => 
      {
        let comparison = 0;
        if (key === 'rating') 
        {
          comparison = Number(a.rating) - Number(b.rating);
        } 
        else if (key === 'year') 
        {
          const yearA = new Date(a.datePublished).getFullYear();
          const yearB = new Date(b.datePublished).getFullYear();
          comparison = yearA - yearB;
        } 
        else 
        {
          const valA = a[key]?.toLowerCase() || '';
          const valB = b[key]?.toLowerCase() || '';
          if (valA < valB) comparison = -1;
          else if (valA > valB) comparison = 1;
        }
        return direction === 'asc' ? comparison : -comparison;
      });
    }
  
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedResult = result.slice(startIndex, startIndex + limit);
  
    return new Response(
      JSON.stringify({ allData: games, data: paginatedResult, total: result.length }),
      {
        status: 200,
        headers: 
        {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
  
  // post = add new
  export async function POST(request) 
  {
    const body = await request.json();
    const errors = validateGame(body);
    if (errors.length > 0) 
    {
      return new Response(JSON.stringify({ errors }), 
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const newGame = { id: Date.now(), ...body };
    games.push(newGame);

    return new Response(JSON.stringify(newGame), 
    {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  // put = update
  export async function PUT(request) 
  {
    const body = await request.json();
    const errors = validateGame(body);
    if (errors.length > 0) 
    {
      return new Response(JSON.stringify({ errors }), 
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!body.id) 
    {
      return new Response(JSON.stringify({ error: 'Missing id' }), 
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const index = games.findIndex(game => game.id === body.id);
    if (index === -1) 
    {
      return new Response(JSON.stringify({ error: 'Game not found' }), 
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    games[index] = { ...games[index], ...body };
    return new Response(JSON.stringify(games[index]), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  export async function DELETE(request) 
  {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) 
    {
      return new Response(JSON.stringify({ error: 'Missing id' }), 
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const index = games.findIndex(game => game.id === id);
    if (index === -1) 
    {
      return new Response(JSON.stringify({ error: 'Game not found' }), 
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const deletedGame = games.splice(index, 1)[0];
    return new Response(JSON.stringify(deletedGame), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  