import { IconSettings, IconSearch, IconX, IconTool, IconPackage, IconMail, IconPencil, IconHelp } from "@tabler/icons-react";

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
        <main className="flex flex-col justify-center items-center gap-8">
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
            <ul className="flex flex-col gap-5 items-center w-full max-w-lg">
                {options.map(({ name, icon: Icon, shortcut }) => (
                    <li key={name} className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2 w-full">
                            <Icon className="size-4" />
                            {name}
                        </span>
                        <span className="ml-4">
                            {shortcut}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="text-center flex flex-col items-center gap-2">
                <span>
                    yunger.dev
                </span>
                <span className="text-sm">
                    v0.1.0-2ba1f6b
                </span>
            </div>
        </main>
    );
}
