import os

file_path = "c:/archivos gaaa/asensor/index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the old HTML block start and end (identifying characteristics)
# It starts with <ul class="light-rope"> and ends with </ul>
# We will find the index of the first occurrence after body start
start_marker = '<ul class="light-rope">'
end_marker = '</ul>'

start_index = content.find(start_marker)
if start_index == -1:
    print("Could not find start marker")
    exit(1)

# Find the matching closing tag. Since there are nested ULs potential elsewhere, we must be careful.
# But in this file, the light-rope UL is top level relative to the update area.
# Actually, let's just use the known structure. It closes before the "Lock Screen" div.
lock_screen_marker = '<div class="item" id="lock-screen"'
lock_screen_index = content.find(lock_screen_marker)

if lock_screen_index == -1:
    print("Could not find lock screen marker")
    # Fallback to finding the first </ul> after start
    end_index = content.find(end_marker, start_index) + len(end_marker)
else:
    # The </ul> should be the last one before the lock screen
    # Search backwards from lock_screen_index
    end_index = content.rfind(end_marker, 0, lock_screen_index) + len(end_marker)

if end_index == -1 or end_index <= start_index:
    print("Could not find end marker properly")
    exit(1)

# New HTML Content
new_html = """    <!-- Christmas Garland with Lights -->
    <div class="christmas-garland">
        <!-- Swag 1 -->
        <div class="garland-swag">
            <ul class="light-rope">
                <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div>
        <!-- Swag 2 -->
        <div class="garland-swag">
            <ul class="light-rope">
                <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div>
        <!-- Swag 3 -->
        <div class="garland-swag">
            <ul class="light-rope">
                <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div>
        <!-- Swag 4 -->
        <div class="garland-swag">
            <ul class="light-rope">
                <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div>
    </div>"""

# Replace
new_content = content[:start_index] + new_html + content[end_index:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully replaced HTML")
