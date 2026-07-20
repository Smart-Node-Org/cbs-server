import sys
import math
for x in sys.stdin:
    if "duration" in x:
        y=int(x.split()[-2])
        h="00"
        if y>=3600000:
            h=int(math.floor(y/3600000))
            if h<10:
                h="0{}".format(h)
            y=y%3600000
        m="00"
        if y>=60000:
            m=int(math.floor(y/60000))
            if m<10:
                m="0{}".format(m)
            y=y%60000
        s="00"
        if y>=1000:
            s=int(math.floor(y/1000))
            if s<10:
                s="0{}".format(s)
            y=y%1000
        print "{}:{}:{}.{}".format(h,m,s,y)
        break
