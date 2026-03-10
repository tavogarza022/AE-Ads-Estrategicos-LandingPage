from PIL import Image, ImageOps
import sys

def process(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Create new data list
    datas = img.getdata()
    newData = []
    
    # The new logo is likely black text on a white/light background
    # We want: 
    # - White background -> Transparent
    # - Black text -> White text
    
    for item in datas:
        # Check if pixel is close to white (background)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            newData.append((255, 255, 255, 0)) # Make Transparent
        else:
            # Check if pixel is dark (text / logo)
            if item[0] < 100 and item[1] < 100 and item[2] < 100:
                newData.append((255, 255, 255, item[3])) # Make White
            else:
                newData.append(item) # Keep original colors for anti-aliasing pixels
                
    img.putdata(newData)
    img.save(output_path, "PNG")

process(sys.argv[1], sys.argv[2])
