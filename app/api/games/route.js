import { query } from '../../lib/db.js';

const corsHeaders = 
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function toISODate(dateVal) 
{
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  return d.toISOString().slice(0, 10);
}
  
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
  
    const whereClauses = [];
    const params = [];
    const search = searchParams.get('search');
    if (search) 
    {
      params.push(`%${search}%`);
      whereClauses.push(`(name ILIKE $${params.length} OR category ILIKE $${params.length})`);
    }
    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
    let orderSQL = '';
    const sortParam = searchParams.get('sort');
    if (sortParam)
    {
      const [key, dir] = sortParam.split('-');
      const colMap =
      {
        rating: 'rating',
        year: 'date_published',
        name: 'name',
        category: 'category',
        publisher: 'publisher'
      };
      const col = colMap[key] || 'name';
      const dirStr = dir.toUpperCase();
      orderSQL = `ORDER BY ${col} ${dirStr}, id ${dirStr}`;
    }
  
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const offset = (page - 1) * limit;
  
    const allRes = await query(`SELECT * FROM games ORDER BY id ASC`);
    const allData = allRes.rows.map(r => (
    {
      id: r.id,
      name: r.name,
      description: r.description,
      publisher: r.publisher,
      datePublished: toISODate(r.date_published),
      rating: Number(r.rating),
      category: r.category,
    }));
  
    const countRes = await query(
      `SELECT COUNT(*) FROM games ${whereSQL}`,
      params
    );
    const total = Number(countRes.rows[0].count);
  
    const dataRes = await query(
      `SELECT * FROM games
       ${whereSQL}
       ${orderSQL}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const data = dataRes.rows.map(r => (
    {
      id: r.id,
      name: r.name,
      description: r.description,
      publisher: r.publisher,
      datePublished: toISODate(r.date_published),
      rating: Number(r.rating),
      category: r.category,
    }));
  
    return new Response(
      JSON.stringify({ allData, data, total }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
  
  export async function POST(request)
  {
    const body = await request.json();
    const errors = validateGame(body);
    if (errors.length)
    {
      return new Response(JSON.stringify({ errors }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  
    const insertRes = await query(
      `INSERT INTO games
       (name, description, publisher, date_published, rating, category)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [body.name, body.description, body.publisher, body.datePublished, body.rating, body.category]
    );

    const g = insertRes.rows[0];
    const newGame =
    {
      id: g.id,
      name: g.name,
      description: g.description,
      publisher: g.publisher,
      datePublished: g.date_published,
      rating: Number(g.rating),
      category: g.category,
    };
    return new Response(JSON.stringify(newGame),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  
  export async function PUT(request) 
  {
    const body = await request.json();
    if (!body.id)
    {
      return new Response(JSON.stringify({ error: 'Missing id' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const errors = validateGame(body);
    if (errors.length)
    {
      return new Response(JSON.stringify({ errors }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  
    const updateRes = await query(
      `UPDATE games SET
         name=$1, description=$2, publisher=$3,
         date_published=$4, rating=$5, category=$6
       WHERE id=$7
       RETURNING *`,
      [body.name, body.description, body.publisher, body.datePublished, body.rating, body.category, body.id]
    );

    if (!updateRes.rowCount)
    {
      return new Response(JSON.stringify({ error: 'Game not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const g = updateRes.rows[0];
    const updated =
    {
      id: g.id,
      name: g.name,
      description: g.description,
      publisher: g.publisher,
      datePublished: g.date_published,
      rating: Number(g.rating),
      category: g.category,
    };

    return new Response(JSON.stringify(updated), {
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
    const delRes = await query(
      `DELETE FROM games WHERE id=$1 RETURNING *`,
      [id]
    );

    if (!delRes.rowCount)
    {
      return new Response(JSON.stringify({ error: 'Game not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const g = delRes.rows[0];
    const deleted =
    {
      id: g.id,
      name: g.name,
      description: g.description,
      publisher: g.publisher,
      datePublished: g.date_published,
      rating: Number(g.rating),
      category: g.category,
    };
    
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }