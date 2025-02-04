import {
    IconSettings,
    IconSearch,
    IconX,
    IconTool,
    IconPackage,
    IconPencil,
    IconHelp,
} from "@tabler/icons-react";

const options = [
    { name: "Find", icon: IconSearch, shortcut: "f" },
    { name: "Writing", icon: IconPencil, shortcut: "w" },
    { name: "Projects", icon: IconPackage, shortcut: "p" },
    { name: "Tools", icon: IconTool, shortcut: "t" },
    { name: "About", icon: IconHelp, shortcut: "a" },
    { name: "Settings", icon: IconSettings, shortcut: "s" },
    { name: "Quit", icon: IconX, shortcut: "q" },
] as const;

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center gap-8">
            <pre className="text-xs">
                {`
                                          
                 ++++++++                 
              +++++++++++++++             
          ++++++++#%%%%#*+++++++          
        ++++++*#%%%%%%%%%%#*++++++        
     ++++++*#%%%%%%%%%%%%%%%%#*+++++++    
   ++++++#%%%%%%%%%%%%%%%%%%%%%%#*+++++   
   ++++++++##%%%%%%%%%%%%%%%%##++++++++   
   +++*#*+++++*#%%%%%%%%%%#*+++++*#*+++   
   +++*%%%#*+++++*#%%%%#*+++++*#%%%*+++   
   +++*%%%%%%%#+++++**+++++##%%%%%%*+++   
   +++*%%%%%%%%%%#*++++*#%%%%%%%%%%*+++   
   +++*%%%%%%%%%%%%*++*%%%%%%%%%%%%*+++   
   +++*%%%%%%%%%%%%*++*%%%%%%%%%%%%*+++   
   +++*%%%%%%%%%%%%*++*%%%%%%%%%%%%*+++   
   +++*%%%%%%%%%%%%*++*%%%%%%%%%%%%*+++   
   +++++*#%%%%%%%%%*++*%%%%%%%%%#*+++++   
    +++++++*#%%%%%%*++*%%%%%%#*+++++++    
       +++++++*#%%%*++*%%%#*+++++++       
          +++++++*#*++*#*+++++++          
              +++++++++++++++             
                 ++++++++                 
                `}
            </pre>
            <ul className="flex w-full max-w-lg flex-col items-center gap-5">
                {options.map(({ name, icon: Icon, shortcut }) => (
                    <li
                        key={name}
                        className="flex w-full items-center justify-between"
                    >
                        <span className="flex w-full items-center gap-2">
                            <Icon className="size-4" />
                            {name}
                        </span>
                        <span className="ml-4">{shortcut}</span>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col items-center gap-2 text-center">
                <span>yunger.dev</span>
                <span className="text-xs">v0.1.0-2ba1f6b</span>
            </div>
        </main>
    );
}
