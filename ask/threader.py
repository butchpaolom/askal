import threading

def threader(function, args):
    if args is None:
        threading.Thread(target=function, args=()).start()
    else:
        threading.Thread(target=function, args=(args,)).start()