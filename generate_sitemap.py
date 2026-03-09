import sqlite3
import os
from datetime import datetime

def generate_sitemap():
    db_path = 'data/realestate.db'
    base_url = 'https://keunmun.up.railway.app'
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    # Connect to DB
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Fetch news articles
    try:
        cursor.execute("SELECT id, updated_at FROM news")
        news_items = cursor.fetchall()
    except sqlite3.OperationalError:
        print("Error: news table not found.")
        news_items = []
    
    conn.close()

    today = datetime.now().strftime('%Y-%m-%d')
    
    # Start XML
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Static pages
    # Home
    xml.append('  <url>')
    xml.append(f'    <loc>{base_url}/</loc>')
    xml.append(f'    <lastmod>{today}</lastmod>')
    xml.append('    <changefreq>daily</changefreq>')
    xml.append('    <priority>1.0</priority>')
    xml.append('  </url>')
    
    # News Board
    xml.append('  <url>')
    xml.append(f'    <loc>{base_url}/news</loc>')
    xml.append(f'    <lastmod>{today}</lastmod>')
    xml.append('    <changefreq>daily</changefreq>')
    xml.append('    <priority>0.8</priority>')
    xml.append('  </url>')
    
    # Dynamic news pages
    for item_id, updated_at in news_items:
        # updated_at format: YYYY-MM-DD HH:MM:SS or similar
        # Extract just YYYY-MM-DD
        last_mod = updated_at.split(' ')[0] if updated_at else today
        
        xml.append('  <url>')
        xml.append(f'    <loc>{base_url}/news/{item_id}</loc>')
        xml.append(f'    <lastmod>{last_mod}</lastmod>')
        xml.append('    <changefreq>weekly</changefreq>')
        xml.append('    <priority>0.6</priority>')
        xml.append('  </url>')
        
    xml.append('</urlset>')
    
    output_path = 'public/sitemap.xml'
    # Ensure public dir exists
    if not os.path.exists('public'):
        os.makedirs('public')
        
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xml))
        
    print(f"Successfully generated {output_path} with {len(news_items)} news articles.")

if __name__ == "__main__":
    generate_sitemap()
