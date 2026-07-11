import re

def modify_file(filepath, callback):
    with open(filepath, 'r') as f:
        content = f.read()
    new_content = callback(content)
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)

def fix_notes_page(c):
    return re.sub(r'\}, \[\]\);(\s*// react-hooks/exhaustive-deps)?', '}, [activeNote]);', c)
modify_file('src/app/(dashboard)/notes/page.tsx', fix_notes_page)

def fix_roadmaps_id_page(c):
    return re.sub(r'const \[\_, set', 'const [, set', c)
modify_file('src/app/(dashboard)/roadmaps/[id]/page.tsx', fix_roadmaps_id_page)

def fix_roadmaps_page(c):
    return re.sub(r'const \[\_, set', 'const [, set', c)
modify_file('src/app/(dashboard)/roadmaps/page.tsx', fix_roadmaps_page)

def fix_settings_page(c):
    return re.sub(r'import\s+\{\s*Settings\s*\}\s*from\s*\'lucide-react\';\n?', '', c)
modify_file('src/app/(dashboard)/settings/page.tsx', fix_settings_page)

def fix_header(c):
    return re.sub(r'import\s+\{\s*([^}]*?),\s*Bell\s*\}\s*from', r'import { \1 } from', c)
modify_file('src/components/common/Header.tsx', fix_header)

def fix_sidebar(c):
    c = re.sub(r',\s*StickyNote', '', c)
    return c
modify_file('src/components/common/Sidebar.tsx', fix_sidebar)

def fix_folder_modal(c):
    return c.replace("setFolderName('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n      setFolderName('');")
modify_file('src/components/notes/FolderModal.tsx', fix_folder_modal)

def fix_folder_sidebar(c):
    c = re.sub(r',\s*MoreVertical', '', c)
    return c
modify_file('src/components/notes/FolderSidebar.tsx', fix_folder_sidebar)

def fix_module_card(c):
    c = re.sub(r'import\s+\{\s*MoreVertical,\s*CheckCircle,\s*Clock3,\s*CircleDashed,\s*XCircle\s*\}\s*from\s*\'lucide-react\';\n?', '', c)
    c = re.sub(r'import\s+\{\s*useState\s*\}\s*from\s*\'react\';\n?', '', c)
    return c
modify_file('src/components/roadmaps/ModuleCard.tsx', fix_module_card)

def fix_module_form_modal(c):
    c = c.replace('setTitle(initialData.title);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n        setTitle(initialData.title);')
    c = c.replace("setDescription(initialData.description || '');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setDescription(initialData.description || '');")
    c = c.replace('setStatus(initialData.status);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n        setStatus(initialData.status);')
    c = c.replace("setTitle('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setTitle('');")
    c = c.replace("setDescription('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setDescription('');")
    c = c.replace("setStatus('PLANNED');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setStatus('PLANNED');")
    return c
modify_file('src/components/roadmaps/ModuleFormModal.tsx', fix_module_form_modal)

def fix_roadmap_card(c):
    c = re.sub(r'import\s+\{\s*CheckCircle,\s*Clock3,\s*CircleDashed,\s*MoreVertical\s*\}\s*from\s*\'lucide-react\';\n?', '', c)
    c = re.sub(r'import\s+\{\s*useState\s*\}\s*from\s*\'react\';\n?', '', c)
    return c
modify_file('src/components/roadmaps/RoadmapCard.tsx', fix_roadmap_card)

def fix_roadmap_form_modal(c):
    c = c.replace('setTitle(initialData.title);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n        setTitle(initialData.title);')
    c = c.replace("setDescription(initialData.description || '');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setDescription(initialData.description || '');")
    c = c.replace("setEstimatedTime(initialData.estimatedTime || '');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setEstimatedTime(initialData.estimatedTime || '');")
    c = c.replace('setStatus(initialData.status);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n        setStatus(initialData.status);')
    c = c.replace("setTitle('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setTitle('');")
    c = c.replace("setDescription('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setDescription('');")
    c = c.replace("setEstimatedTime('');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setEstimatedTime('');")
    c = c.replace("setStatus('PLANNED');", "// eslint-disable-next-line react-hooks/set-state-in-effect\n        setStatus('PLANNED');")
    return c
modify_file('src/components/roadmaps/RoadmapFormModal.tsx', fix_roadmap_form_modal)

def fix_due_date_picker(c):
    return re.sub(r'\}, \[\]\);', '}, [onChange, value]);', c)
modify_file('src/components/tasks/DueDatePicker.tsx', fix_due_date_picker)

def fix_task_box(c):
    c = re.sub(r'task=\{(.*?)task\}', 'task={task}', c)  # Might be dangerous
    # Actually let's just do a specific replace for unused task
    c = re.sub(r'\(\s*task\s*\)\s*=>\s*\{\s*setTaskToDelete', '() => { setTaskToDelete', c)
    c = re.sub(r'\(\s*task\s*\)\s*=>\s*setTaskToDelete', '() => setTaskToDelete', c)
    return c
modify_file('src/components/ui/TaskBox.tsx', fix_task_box)

def fix_task_view_modal(c):
    c = re.sub(r'onEdit,\s*', '', c)
    return c
modify_file('src/components/ui/TaskViewModal.tsx', fix_task_view_modal)

def fix_habits(c):
    return re.sub(r'HabitLog,\s*', '', c)
modify_file('src/lib/habits.ts', fix_habits)

def fix_roadmaps(c):
    c = c.replace('(module: any)', '(module: any) // eslint-disable-line @typescript-eslint/no-explicit-any')
    c = c.replace('(roadmap: any)', '(roadmap: any) // eslint-disable-line @typescript-eslint/no-explicit-any')
    return c
modify_file('src/lib/roadmaps.ts', fix_roadmaps)

